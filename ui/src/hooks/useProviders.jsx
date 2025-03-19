// useUser.js
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

axios.defaults.withCredentials = true;
const URLAPI = process.env.NEXT_PUBLIC_URLAPI;
