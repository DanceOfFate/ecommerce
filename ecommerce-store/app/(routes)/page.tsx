"use client"
import { useEffect, useState } from "react";
import { Billboard } from "../components/billboard";
import { Container } from "../components/ui/container";
import getBillboard from "@/actions/get-billboard";

export const revalidate = 0;

const HomePage = () => {
    const [billboard, setBillboard] = useState({});

    useEffect(() => {
        getBillboard("5a3bc013-a890-49e7-88ee-f4089af6181e").then(response => {
            setBillboard(response)
        })        
    }, [])

    console.log(billboard);
    

    return(
        <Container>
            <div className="space-y-10 pb-10">
               {/* @ts-ignore */}
                <Billboard data={billboard} />
            </div>
        </Container>
    )
}

export default HomePage;