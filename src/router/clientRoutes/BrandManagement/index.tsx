import { useEffect, useState } from "react";
import {
    IconButton,
    Tooltip,
    CircularProgress,
    Paper,

} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";

import React from "react";
import { IoMdAddCircle } from "react-icons/io";
import { Button } from "../../../components/ui/button";
import AddBrandModal from "./AddBrandForm";
import EditBrandForm from "./EditBrandForm";

const ITEMS_PER_PAGE = 5;

const BrandsManagement = () => {
    const sampleBrands = [
        {
            id: "1",
            label: 'Cocoon',
            value: 'cocoon',
            logo: 'https://mir-s3-cdn-cf.behance.net/project_modules/1400/202667140005381.6239fc9e2048c.png'
        },
        {
            id: "2",
            label: 'L\'Oreal',
            value: 'loreal',
            logo: 'https://cdn.worldvectorlogo.com/logos/l-oreal-3.svg'
        },
        {
            id: "3",
            label: 'CeraVe',
            value: 'cerave',
            logo: 'https://i.pinimg.com/originals/01/df/ad/01dfadb784cdcd91ebb730d30592b481.png'
        },
        {
            id: "4",
            label: 'Cetaphil',
            value: 'cetaphil',
            logo: 'https://www.cetaphil.com.vn/on/demandware.static/-/Sites/default/dwf51c375b/Cetaphil_Logo_285.png'
        },
        {
            id: "5",
            label: 'The Ordinary',
            value: 'ordinary',
            logo: 'https://logovectordl.com/wp-content/uploads/2020/12/the-ordinary-logo-vector.png'
        },
        {
            id: "6",
            label: 'Hada Labo',
            value: 'hada_labo',
            logo: 'https://hadalabo.com.vn/wp-content/uploads/2021/03/HDLB_logo_m.png'
        },
        {
            id: "7",
            label: 'Kiehl\'s',
            value: 'kiehls',
            logo: 'https://cdn.freebiesupply.com/logos/large/2x/kiehls-logo-png-transparent.png'
        }
    ];

    const [brands, setBrands] = useState(sampleBrands);
    //const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [openAddBrand, setOpenAddBrand] = useState<boolean>(false);

    const [openEditBrand, setOpenEditBrand] = useState<boolean>(false);
    const [currentBrand, setCurrentBrand] = useState<any | null>(null);


    const [currentPage, setCurrentPage] = useState<number>(1);

    const totalPages = Math.ceil(brands?.length / ITEMS_PER_PAGE);
    const paginatedbrands = brands?.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    //   const fetchCategories = () => {
    //     setLoading(true);
    //     getAllCategories()
    //       .then((data) => {
    //         setCategories(data.data);
    //       })
    //       .catch((error) => {
    //         console.error("Error fetching accounts:", error);
    //       })
    //       .finally(() => {
    //         setLoading(false);
    //       });
    //   };

    //   useEffect(() => {
    //     fetchCategories();
    //   }, []);

    const renderTable = () => (
        <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
            {/* Header Row */}
            <div
                style={{
                    display: 'flex',
                    fontWeight: 'bold',
                    backgroundColor: '#f1f1f1',
                    padding: '10px',
                    borderRadius: '8px',
                    marginBottom: '10px',
                }}
            >
                <div style={{ flex: 0.5 }}>ID</div>
                <div style={{ flex: 2 }}>Name</div>
                <div style={{ flex: 2 }}>Logo</div>
                <div style={{ flex: 1 }}>Actions</div>
            </div>

            {/* Data Rows */}
            {paginatedbrands?.map((account: any) => (
                <React.Fragment key={account.id}>
                    <div
                        style={{
                            display: 'flex',
                            padding: '10px',
                            cursor: 'pointer',
                            backgroundColor: '#fff',
                            borderBottom: '1px solid #ddd',
                            transition: 'background-color 0.3s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f1f1')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
                    >
                        <div style={{ flex: 0.5 }}>{account.id}</div>
                        <div style={{ flex: 2 }}>{account.label}</div>
                        <div style={{ flex: 2 }}>
                            <img
                                src={account.logo || "https://github.com/shadcn.png"}
                                alt="Avatar"
                                style={{
                                    height: 70,
                                    width: 120,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    objectFit: "cover",
                                }}
                            /></div>
                        <div style={{ flex: 1 }}>
                            <div style={{ flex: 1 }}>
                                <Tooltip title="Edit Brand">
                                    <IconButton
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentBrand(account);
                                            setOpenEditBrand(true);
                                        }}
                                        sx={{ color: 'blue', '&:hover': { color: '#1976d2' } }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            ))}
            <div style={{ marginTop: "20px", marginBottom: '10px', display: "flex", justifyContent: "end" }}>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        style={{
                            margin: "0 5px",
                            padding: "5px 10px",
                            backgroundColor: currentPage === index + 1 ? "#419f97" : "#f1f1f1",
                            color: currentPage === index + 1 ? "white" : "black",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </Paper>

    );

    return (
        <>
            <div className="bg-gray-100 pt-5 pb-5 pl-5 pr-5">
                <div className="flex justify-between mb-5 mt-1">
                    <h2 className="text-xl" style={{ marginLeft: "16px", color: "#3f51b5", fontWeight: "bold" }}>
                        BRANDS MANAGEMENT
                    </h2>

                    <Button onClick={() => setOpenAddBrand(true)} className="gap-2">
                        <IoMdAddCircle />
                        Add Brand
                    </Button>
                </div>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <>
                        {renderTable()}
                    </>
                )}

                {brands && (
                    <AddBrandModal
                        isOpen={openAddBrand}
                        setIsOpen={(open: boolean) => setOpenAddBrand(open)}
                        fetchBrand={async () => {
                            //fetchCategories();
                        }}
                    />
                )}

                {brands && (
                    <EditBrandForm
                        isOpen={openEditBrand}
                        setIsOpen={(open: boolean) => setOpenEditBrand(open)}
                        category={currentBrand}
                        fetchBrand={async () => {
                            //fetchCategories();
                        }}
                    />
                )}
            </div>
        </>
    );
};

export default BrandsManagement;