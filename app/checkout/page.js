'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { useCartContext } from '@/context/CartContext';

function Checkout() {
  const { cart, getTotalItems, getTotalPrice } = useCartContext();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    province: '',
    city: '',
    postalCode: '',
  });

  const provinces = [
    { id: 'punjab', name: 'Punjab' },
    { id: 'sindh', name: 'Sindh' },
    { id: 'kpk', name: 'Khyber Pakhtunkhwa' },
    { id: 'balochistan', name: 'Balochistan' },
    { id: 'gilgit_baltistan', name: 'Gilgit-Baltistan' },
    { id: 'azad_kashmir', name: 'Azad Kashmir' },
    { id: 'islamabad', name: 'Islamabad Capital Territory' },
  ];

  const citiesByProvince = {
    punjab: [
      { id: 'lahore', name: 'Lahore' },
      { id: 'faisalabad', name: 'Faisalabad' },
      { id: 'rawalpindi', name: 'Rawalpindi' },
      { id: 'gujranwala', name: 'Gujranwala' },
      { id: 'sialkot', name: 'Sialkot' },
      { id: 'multan', name: 'Multan' },
      { id: 'bahawalpur', name: 'Bahawalpur' },
    ],
    sindh: [
      { id: 'karachi', name: 'Karachi' },
      { id: 'hyderabad', name: 'Hyderabad' },
      { id: 'sukkur', name: 'Sukkur' },
      { id: 'larkana', name: 'Larkana' },
      { id: 'mirpurkhas', name: 'Mirpur Khas' },
    ],
    kpk: [
      { id: 'peshawar', name: 'Peshawar' },
      { id: 'abbottabad', name: 'Abbottabad' },
      { id: 'mardan', name: 'Mardan' },
      { id: 'swat', name: 'Swat' },
      { id: 'kohat', name: 'Kohat' },
    ],
    balochistan: [
      { id: 'quetta', name: 'Quetta' },
      { id: 'gwadar', name: 'Gwadar' },
      { id: 'khuzdar', name: 'Khuzdar' },
      { id: 'loralai', name: 'Loralai' },
      { id: 'turbat', name: 'Turbat' },
    ],
    gilgit_baltistan: [
      { id: 'gilgit', name: 'Gilgit' },
      { id: 'skardu', name: 'Skardu' },
      { id: 'hunza', name: 'Hunza' },
      { id: 'chilas', name: 'Chilas' },
    ],
    azad_kashmir: [
      { id: 'muzaffarabad', name: 'Muzaffarabad' },
      { id: 'mirpur', name: 'Mirpur' },
      { id: 'bhimber', name: 'Bhimber' },
      { id: 'rawalakot', name: 'Rawalakot' },
    ],
    islamabad: [
      { id: 'islamabad', name: 'Islamabad' },
    ],
  };

  const handleFirstNameChange = (e) => {
    setForm((prevData) => ({ ...prevData, firstName: e.target.value }));
  };

  const handleLastNameChange = (e) => {
    setForm((prevData) => ({ ...prevData, lastName: e.target.value }));
  };

  const handleEmailChange = (e) => {
    setForm((prevData) => ({ ...prevData, email: e.target.value }));
  };

  const handlePhoneChange = (e) => {
    setForm((prevData) => ({ ...prevData, phone: e.target.value }));
  };

  const handleAddressChange = (e) => {
    setForm((prevData) => ({ ...prevData, address: e.target.value }));
  };

  const handleProvinceChange = (value) => {
    setForm((prevData) => ({ ...prevData, province: value, city: '' }));
  };

  const handleCityChange = (value) => {
    setForm((prevData) => ({ ...prevData, city: value }));
  };

  const handlePostalCodeChange = (e) => {
    setForm((prevData) => ({ ...prevData, postalCode: e.target.value }));
  };

  return (
    <div className="container mx-auto flex flex-col md:flex-row gap-8 p-6">
      {/* Order Preview Section */}
      <div className="md:w-1/2 border shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">Order Preview</h2>
        {cart.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <ul className="space-y-4">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between border-b pb-4"
              >
                <img src={item.image[0]} alt={item.name} className="w-20 h-20 rounded object-cover" />
                <div className="ml-4 flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </h3>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-gray-600">Price: {Math.floor(item.price)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 text-right">
          <p className="text-lg font-semibold">
            Total Items: {getTotalItems()}
          </p>
          <p className="text-lg font-semibold">
            Total Price: {getTotalPrice().toFixed(0)}
          </p>
        </div>
      </div>

      {/* Details Form Section */}
      <Card className="md:w-1/2 border shadow-md">
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
            Fill out the details below to complete your order.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={form.firstName}
                  onChange={handleFirstNameChange}
                  placeholder="Enter your first name"
                />
              </div>

              {/* Last Name */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={form.lastName}
                  onChange={handleLastNameChange}
                  placeholder="Enter your last name"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={handlePhoneChange}
                  placeholder="e.g., +92 300 1234567"
                />
              </div>

              <Separator className="my-6 md:col-span-2" />

              {/* Address */}
              <div className="flex flex-col space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={handleAddressChange}
                  placeholder="123 Main Street"
                />
              </div>

              {/* Province */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="province">Province</Label>
                <Select
                  onValueChange={handleProvinceChange}
                  value={form.province}
                >
                  <SelectTrigger>
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
                <Label htmlFor="city">City</Label>
                <Select
                  disabled={!form.province}
                  onValueChange={handleCityChange}
                  value={form.city}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    {form.province &&
                      citiesByProvince[form.province]?.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Postal Code */}
              <div className="flex flex-col space-y-2 md:col-span-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={form.postalCode}
                  onChange={handlePostalCodeChange}
                  placeholder="12345"
                />
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            Place Order
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Checkout;
