import type { CustomerProfile } from '@/types/customer'

/**
 * TODO: Replace with production customer lookup API when available.
 */
export const MOCK_CUSTOMERS: CustomerProfile[] = [
  {
    id: 'c1',
    phone: '9876543210',
    name: 'Rahul Sharma',
    addressLine1: '42 MG Road',
    addressLine2: 'Near City Mall',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
  },
  {
    id: 'c2',
    phone: '9123456789',
    name: 'Priya Patel',
    addressLine1: '15 Park Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
  },
  {
    id: 'c3',
    phone: '9988776655',
    name: 'Ananya Reddy',
    addressLine1: '88 Jubilee Hills',
    addressLine2: 'Road No. 36',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500033',
  },
  {
    id: 'c4',
    phone: '8765432109',
    name: 'Vikram Singh',
    addressLine1: '7 Connaught Place',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
  },
  {
    id: 'c5',
    phone: '9001234567',
    name: 'Meera Nair',
    addressLine1: '23 Marine Drive',
    addressLine2: 'Apt 4B',
    city: 'Kochi',
    state: 'Kerala',
    pincode: '682001',
  },
]

export function findCustomerByPhone(phone: string): CustomerProfile | undefined {
  return MOCK_CUSTOMERS.find((customer) => customer.phone === phone)
}
