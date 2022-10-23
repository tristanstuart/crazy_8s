import React from "react";
import Card from "./Card";

export default function SandBox(){

    return(
        <div className="container mx-auto shadow-md bg-green-300 md:max-w-2xl">
            <div className="flex flex-grow">
                    <Card rank={'1'} suits={'hearts'} />
                    <Card rank={'2'} suits={'hearts'}  />
                    <Card rank={'3'} suits={'hearts'} />
                    <Card rank={'4'} suits={'hearts'} />
                    <Card rank={'5'} suits={'hearts'} />
                    <Card rank={'6'} suits={'hearts'} />
                    <Card rank={'7'} suits={'hearts'} />
                    <Card rank={'8'} suits={'hearts'} />
                    <Card rank={'9'} suits={'hearts'} />
                    <Card rank={'10'} suits={'hearts'} />
                    <Card rank={'11'} suits={'hearts'} />
                    <Card rank={'12'} suits={'hearts'} />
                    <Card rank={'13'} suits={'hearts'} />

            </div>
            container
        </div>
    )
}