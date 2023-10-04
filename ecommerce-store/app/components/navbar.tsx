"use client"
import Link from "next/link"
import { Container } from "./ui/container"
import { MainNav } from "./main-nav"
import  getCategories from "@/actions/get-categories"
import { useEffect, useState } from "react"
import { Category } from "@/types"
import { NavbarActions } from "./navbar-actions"




export const Navbar = () => {
    const [categories, setCategories] = useState<Category[]>([])
    // const categories = await getCategories();

    useEffect(() => {
        getCategories().then(response => {
            setCategories(response)
        })
    }, [])
   

    return(
        <div className="border-b">
            <Container>
                <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center">
                    <Link href="/" className="ml-4 flex lg:ml-0 gap-x-2">
                        <p className="font-bold text-xl">STORE</p>
                    </Link>
                    <MainNav data={categories} />
                    <NavbarActions />
                </div>
            </Container>
        </div>
    )
}