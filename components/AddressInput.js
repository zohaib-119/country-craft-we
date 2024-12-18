'use client'

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function AddressInput() {
  const [province, setProvince] = useState("")
  const [city, setCity] = useState("")

  // Provinces and Cities specific to Pakistan
  const provinces = [
    { id: "punjab", name: "Punjab" },
    { id: "sindh", name: "Sindh" },
    { id: "kpk", name: "Khyber Pakhtunkhwa" },
    { id: "balochistan", name: "Balochistan" },
  ]

  const citiesByProvince = {
    punjab: [
      { id: "lahore", name: "Lahore" },
      { id: "faisalabad", name: "Faisalabad" },
      { id: "multan", name: "Multan" },
    ],
    sindh: [
      { id: "karachi", name: "Karachi" },
      { id: "hyderabad", name: "Hyderabad" },
      { id: "sukkur", name: "Sukkur" },
    ],
    kpk: [
      { id: "peshawar", name: "Peshawar" },
      { id: "abbottabad", name: "Abbottabad" },
      { id: "mansehra", name: "Mansehra" },
    ],
    balochistan: [
      { id: "quetta", name: "Quetta" },
      { id: "gwadar", name: "Gwadar" },
      { id: "turbat", name: "Turbat" },
    ],
  }

  return (
    <Card className="w-[400px] border shadow-md">
      <CardHeader>
        <CardTitle className="text-black">Enter Address</CardTitle>
        <CardDescription className="text-gray-600">
          Fill out your address details to proceed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            {/* Address Line */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="address">Address Line</Label>
              <Input
                id="address"
                placeholder="123 Main Street"
                className="focus:ring-black"
              />
            </div>

            {/* Province */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="province">Province</Label>
              <Select
                onValueChange={(value) => {
                  setProvince(value)
                  setCity("") // Reset city when province changes
                }}
              >
                <SelectTrigger
                  id="province"
                  className="focus:ring-black"
                >
                  <SelectValue placeholder="Select Province" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {provinces.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="city">City</Label>
              <Select
                disabled={!province}
                onValueChange={(value) => setCity(value)}
              >
                <SelectTrigger
                  id="city"
                  className={`focus:ring-black ${
                    !province && "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {province &&
                    citiesByProvince[province]?.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Postal Code */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="postal">Postal Code</Label>
              <Input
                id="postal"
                placeholder="12345"
                className="focus:ring-black"
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="e.g. +92 300 1234567"
                className="focus:ring-black"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" className="text-black border-black border-2 hover:bg-gray-100">
          Cancel
        </Button>
        <Button className="bg-black text-white hover:bg-gray-800">
          Submit
        </Button>
      </CardFooter>
    </Card>
  )
}

export default AddressInput
