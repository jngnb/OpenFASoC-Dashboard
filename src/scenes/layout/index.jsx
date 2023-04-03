import React, { useState } from "react"
import { Box, useMediaQuery } from "@mui/material"
import { Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import Navbar from "components/Navbar"
import Sidebar from "components/Sidebar"

const Layout = () => {
    //true or false ool whether or not min-width is achieved
    const isNonMobile = useMediaQuery("(min-width: 600px)");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    return ( 
        <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
        {/* <Box display="flex" width="100%" height="100%"> */}
            <Sidebar
                isNonMobile={isNonMobile}
                drawerWidth="250px"
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen} 
            />
            <Box>
                <Navbar 
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen} 
                />
                <Outlet />
            </Box>
        </Box>
    )
}

export default Layout;
