"use client";

import { useState, useEffect } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface AddressLookupCardProps {
  address: string;
  isLoading: boolean;
  onLookup: (address: string) => void;
  error?: string | null;
}

export function AddressLookupCard({
  address,
  isLoading,
  onLookup,
  error,
}: AddressLookupCardProps) {
  const [inputAddress, setInputAddress] = useState(address);
  const [noChangeError, setNoChangeError] = useState(false);

  useEffect(() => {
    setInputAddress(address);
    setNoChangeError(false);
  }, [address]);

  const handleUpdate = () => {
    const trimmed = inputAddress.trim();
    
    // Check if address has changed
    if (trimmed === address.trim()) {
      setNoChangeError(true);
      return;
    }
    
    setNoChangeError(false);
    if (trimmed) onLookup(trimmed);
  };
  
  const handleInputChange = (value: string) => {
    setInputAddress(value);
    // Clear error when user starts typing
    if (noChangeError) {
      setNoChangeError(false);
    }
  };

  return (
    <section>
      <Card className="shadow-sm rounded-sm border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-slate-600" />
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">
              Property address
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              type="text"
              value={inputAddress}
              onChange={(e) => handleInputChange(e.target.value)}
              className="h-11"
              placeholder="Enter address..."
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="default"
              size="default"
              className="h-11 w-full"
              onClick={handleUpdate}
              disabled={isLoading || !inputAddress.trim() || inputAddress.trim() === address.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
            {noChangeError && (
              <p className="text-sm text-red-600">
                Address hasn't changed. Enter a different address to update.
              </p>
            )}
            {error && (
              <p className="text-sm text-red-600">
                {error}. Retry the address or adjust values manually below.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
