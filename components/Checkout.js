'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FaUser, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaCity, FaTruck } from 'react-icons/fa'
import Image from 'next/image'
import { Separator } from "@/components/ui/separator";

function CheckoutComponent() {
    const [province, setProvince] = useState('')
    const [city, setCity] = useState('')

    const provinces = [
        { id: 'punjab', name: 'Punjab' },
        { id: 'sindh', name: 'Sindh' },
        { id: 'kpk', name: 'Khyber Pakhtunkhwa' },
    ]

    const citiesByProvince = {
        punjab: [
            { id: 'lahore', name: 'Lahore' },
            { id: 'faisalabad', name: 'Faisalabad' },
        ],
        sindh: [
            { id: 'karachi', name: 'Karachi' },
            { id: 'hyderabad', name: 'Hyderabad' },
        ],
    }

    return (
        <Card className="w-full max-w-3xl mx-auto border shadow-md">
            {/* Header */}
            <CardHeader className="flex flex-col items-center">
                <Image
                    src="https://cdn-icons-png.flaticon.com/512/950/950244.png"
                    alt="Checkout Image"
                    width={150}
                    height={100}
                    className="rounded-md"
                />
                <CardTitle className="text-orange-600 mt-4">Checkout</CardTitle>
                <CardDescription className="text-gray-500">
                    Complete your order by filling out the details below.
                </CardDescription>
            </CardHeader>

            {/* Form Content */}
            <CardContent>
                <form>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="first-name">
                                <FaUser className="inline-block mr-1" /> First Name
                            </Label>
                            <Input id="first-name" placeholder="Enter your first name" />
                        </div>

                        {/* Last Name */}
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="last-name">
                                <FaUser className="inline-block mr-1" /> Last Name
                            </Label>
                            <Input id="last-name" placeholder="Enter your last name" />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="email">
                                <FaEnvelope className="inline-block mr-1" /> Email
                            </Label>
                            <Input id="email" type="email" placeholder="Enter your email" />
                        </div>

                        {/* Phone */}
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="phone">
                                <FaPhoneAlt className="inline-block mr-1" /> Phone Number
                            </Label>
                            <Input id="phone" placeholder="e.g., +92 300 1234567" />
                        </div>

                        <Separator className="my-6 md:col-span-2" />

                        {/* Address */}
                        <div className="flex flex-col space-y-2 md:col-span-2">
                            <Label htmlFor="address">
                                <FaMapMarkerAlt className="inline-block mr-1" /> Address
                            </Label>
                            <Input id="address" placeholder="123 Main Street" />
                        </div>

                        {/* Province */}
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="province">
                                <FaTruck className="inline-block mr-1" /> Province
                            </Label>
                            <Select
                                onValueChange={(value) => {
                                    setProvince(value)
                                    setCity('')
                                }}
                            >
                                <SelectTrigger id="province" className="focus:ring-orange-500">
                                    <SelectValue placeholder="Select Province" />
                                </SelectTrigger>
                                <SelectContent>
                                    {provinces.map((p) => (
                                        <SelectItem key={p.id} value={p.id}>
                                            {p.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* City */}
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="city">
                                <FaCity className="inline-block mr-1" /> City
                            </Label>
                            <Select disabled={!province} onValueChange={(value) => setCity(value)}>
                                <SelectTrigger
                                    id="city"
                                    className={`focus:ring-orange-500 ${!province && 'opacity-50 cursor-not-allowed'
                                        }`}
                                >
                                    <SelectValue placeholder="Select City" />
                                </SelectTrigger>
                                <SelectContent>
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
                        {/* Address */}
                        <div className="flex flex-col space-y-2 md:col-span-2">
                            <Label htmlFor="postal">
                                <FaMapMarkerAlt className="inline-block mr-1" /> Postal Code
                            </Label>
                            <Input id="postal" placeholder="12345" />
                        </div>
                    </div>
                </form>
            </CardContent>

            {/* Footer */}
            <CardFooter className="flex justify-end">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    Place Order
                </Button>
            </CardFooter>
        </Card>
    )
}

export default CheckoutComponent
