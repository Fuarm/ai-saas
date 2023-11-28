"use client";

import { Crisp } from "crisp-sdk-web";
import {useEffect} from "react";

const CRISP_WEBSITE_ID = "04ecc72f-fcfc-4152-9928-1c24f39add48";
export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure(CRISP_WEBSITE_ID);
  }, []);

  return null;
}