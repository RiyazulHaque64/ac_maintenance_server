import { PropertyStatus, PropertyType } from "@prisma/client";

export interface PropertyContactInfo {
  name: string;
  email: string;
  phone?: string;
}

export interface IPropertyLocation {
  city?: string;
  state?: string;
  country?: string;
  street?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
}

export interface IPropertyDetails {
  area_size: number;
  bedroom?: number;
  bathroom?: string;
  parking_spot?: number;
  available_from?: string;
  property_lot_size?: string;
  year_build?: string;
  structure_type?: string;
  price_info?: string;
  room?: number;
}

export interface IProperty {
  title: string;
  price: number;
  description?: string;
  property_type?: PropertyType;
  status?: PropertyStatus;
  tags?: string[];
  contact_info: PropertyContactInfo;
  location?: IPropertyLocation;
  property_details?: IPropertyDetails;
  features?: string[];
  feature_image?: string;
  images?: string[];
}
