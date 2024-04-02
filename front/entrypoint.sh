#!/bin/bash
npm install
echo 'VITE_API_URL='$SEVER_HOST>.env.development
echo 'VITE_FRONT_URL='$FRONT_HOST>>.env.development
npm run dev -- --host
