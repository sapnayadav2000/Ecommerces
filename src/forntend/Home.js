import React, { useEffect, useState } from "react";
import HomeHeader from "./HomeHeader";
import Footer from "./Footer";
import Slider from "../forntend/Slider/Slider";
import HomeCategory from "../forntend/category/HomeCategory";
import HomeBanner from "../forntend/banner/HomeBanner";
import HomeProduct from "../forntend/product/HomeProduct";
import NewArrivals from "../forntend/banner/NewArrivals";
import Kurti from "../forntend/banner/kurti";
import Service from "../forntend/Service/Service";
import SilkSaree from "../forntend/banner/silkSaree"
import IndoWestern from "./banner/IndoWester";
export default function Home() {
  return (
    <div className="Container">
      <HomeHeader />
      <Slider />
      <HomeCategory />
      <HomeBanner />
      <HomeProduct />
      <NewArrivals />
       <Kurti/>
    
    <SilkSaree/>
    <IndoWestern/>
      <Service />
      <Footer />
    </div>
  );
}
