import axios from "axios";
import { districts, provinces, wards } from "./Address";

export async function GetAllProvinces(){
    const response = provinces.data;
    return response.data;
}

export async function GetProvinceByName(id: string){
    const response = provinces.data.data.filter((item: any) => item.name_with_type === id);
    return response[0];
}

export async function GetDistrictByName(id: string){
    const response = districts.data.data.filter((item: any) => item.name_with_type === id);
    return response[0];
}

export async function GetWardByName(id: string){
    const response = wards.data.data.filter((item: any) => item.name_with_type === id);
    return response[0];
}

export async function GetWardByCode(districtCode: string){
    const response = wards.data.data.filter((item: any) => item.code === districtCode);
    return response[0];
}

export async function GetProvinceByCode(id: string){
    const response = provinces.data.data.filter((item: any) => item.code === id);
    return response[0];
}

export async function GetDistrictByCode(id: string){
    const response = districts.data.data.filter((item: any) => item.code === id);
    return response[0];
}

export async function GetAllDistrictsByProvince(provinceCode: string){
    const response = districts.data.data.filter((item: any) => item.parent_code === provinceCode);
    return response;
}

export async function GetAllWardsByDistrict(districtCode: string){
    const response = wards.data.data.filter((item: any) => item.parent_code === districtCode);
    return response;
}
