// 🔒 CORE SYSTEM - DO NOT MODIFY
// Billing and subscription management dashboard
// Shows current plan, billing info, and upgrade options

"use client";

import Header from "@/components/Header";
import { UpgradeButton } from "@/components/UpgradeButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap } from "lucide-react";
import { StatusMessages } from "@/components/StatusMessages";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";

// Define types for subscription data
interface SubscriptionData {
  id: string;
  plan: {
    name: string;
    displayName: string;
    description?: string;
  };
  status: string;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd: boolean;
}

interface EntitlementData {
  id: string;
  name: string;
  displayName: string;
  description?: string;
}

const BillingPage = () => {
  const searchParams = useSearchParams();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(
    null
  );
  const [entitlements, setEntitlements] = useState<EntitlementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const hasFetchedRef = useRef(false);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    }

    try {
      const [subRes, entRes] = await Promise.all([
        fetch("/api/user/subscription"),
        fetch("/api/user/entitlements"),
      ]);

      if (subRes.ok) {
        const subData = await subRes.json();
        setSubscription(subData.subscription);
      }

      if (entRes.ok) {
        const entData = await entRes.json();
        setEntitlements(entData.entitlements || []);
      }
    } catch (error) {
      console.error("Failed to fetch subscription data:", error);
    } finally {
      setLoading(false);
      if (isRefresh) {
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    // Prevent duplicate API calls in React StrictMode or on re-renders
    if (hasFetchedRef.current) {
      return;
    }
    hasFetchedRef.current = true;

    const success = searchParams.get("success");

    if (success === "true") {
      // If success param is present, delay API loading to allow webhook processing
      const timer = setTimeout(() => {
        fetchData();
      }, 2000); // 2 second delay for webhook processing

      return () => clearTimeout(timer);
    } else {
      // Normal loading without delay
      fetchData();
    }
  }, [searchParams, fetchData]);

  const isPro = subscription?.plan?.name === "pro";
  const isFree = !subscription || subscription.plan?.name === "free";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Billing & Subscription
                </h1>
                <p className="mt-2 text-gray-600">
                  Manage your subscription and billing information.
                </p>
              </div>
              {refreshing ? (
                <div className="flex items-center space-x-2 text-sm text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Updating subscription data...</span>
                </div>
              ) : (
                <Button
                  onClick={() => fetchData(true)}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Refresh Data
                </Button>
              )}
            </div>
          </div>

          {/* Status Messages */}
          <StatusMessages />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Plan */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {isPro ? (
                      <Crown className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <Zap className="h-5 w-5 text-blue-500" />
                    )}
                    Current Plan
                  </CardTitle>
                  <Badge variant={isPro ? "default" : "secondary"}>
                    {subscription?.plan.displayName || "Free Plan"}
                  </Badge>
                </div>
                <CardDescription>
                  {subscription?.plan.description ||
                    "Basic features for getting started"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subscription && (
                    <div className="text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="capitalize">
                          {subscription.status}
                        </span>
                      </div>
                      {subscription.currentPeriodEnd && (
                        <div className="flex justify-between">
                          <span>Next billing:</span>
                          <span>
                            {new Date(
                              subscription.currentPeriodEnd
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {subscription.cancelAtPeriodEnd && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-xs">
                          Your subscription will cancel at the end of the
                          current billing period.
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Your Features:</h4>
                    <ul className="space-y-1">
                      {entitlements.map((entitlement) => (
                        <li
                          key={entitlement.id}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          {entitlement.displayName}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upgrade Options */}
            <Card>
              <CardHeader>
                <CardTitle>Upgrade Your Plan</CardTitle>
                <CardDescription>
                  Unlock more features and capabilities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isFree && (
                    <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-blue-900">Pro Plan</h3>
                        <Badge variant="outline">$29/month</Badge>
                      </div>
                      <p className="text-sm text-blue-700 mb-3">
                        Advanced features for growing businesses.
                      </p>
                      <UpgradeButton planName="pro" className="w-full">
                        Upgrade to Pro
                      </UpgradeButton>
                    </div>
                  )}

                  {isPro && (
                    <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-green-900">
                          Pro Plan Active
                        </h3>
                        <Badge variant="default">Current</Badge>
                      </div>
                      <p className="text-sm text-green-700 mb-3">
                        You&apos;re enjoying all Pro features!
                      </p>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full">
                          Manage Billing
                        </Button>
                        {!subscription?.cancelAtPeriodEnd && (
                          <Button
                            variant="outline"
                            className="w-full text-red-600 hover:text-red-700"
                          >
                            Cancel Subscription
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mt-4">
                    Need help? Contact our support team.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BillingPage;
