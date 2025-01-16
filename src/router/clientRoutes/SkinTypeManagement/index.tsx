import { useEffect, useState } from "react";
import {
    CircularProgress,
    Paper,

} from "@mui/material";

import React from "react";


const SkinTypesManagement = () => {
    const sampleSkinTypes = [
        { id: "1", label: 'Da Dầu', description: 'Oily skin is characterized by excess oil production, leading to shiny skin and often enlarged pores. It is prone to acne and blackheads.' },
        { id: "2", label: 'Da Khô', description: 'Dry skin can feel tight, rough, and may appear flaky or dull. It lacks natural moisture and can be more sensitive to environmental factors.' },
        { id: "3", label: 'Da Nhạy Cảm', description: 'Sensitive skin reacts easily to products, weather, or other environmental factors. It may experience redness, itching, or irritation.' },
        { id: "4", label: 'Da Hỗn Hợp', description: 'Combination skin features a mix of dry and oily areas, typically with an oily T-zone (forehead, nose, chin) and dry or normal cheeks.' },
        { id: "5", label: 'Da Lão Hóa', description: 'Aging skin tends to show signs of fine lines, wrinkles, and loss of elasticity. It can feel drier and more sensitive due to a decrease in collagen production.' },
        { id: "6", label: 'Da Mụn', description: 'Acne-prone skin is characterized by frequent breakouts, pimples, and blackheads. It may be oily and prone to clogged pores.' }
    ];
    const [skintypes, setSkintypes] = useState(sampleSkinTypes);
    //const [skintypes, setSkintypes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentSkintypes, setCurrentSkintypes] = useState<any | null>(null);

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
                <div style={{ flex: 2 }}>Description</div>
            </div>

            {/* Data Rows */}
            {skintypes?.map((account) => (
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
                        <div style={{ flex: 2 }}>{account.description}</div>
                    </div>
                </React.Fragment>
            ))}
        </Paper>

    );

    return (
        <>
            <div className="bg-gray-100 pt-5 pb-5 pl-5 pr-5">
                <div className="flex justify-between mb-5 mt-1">
                    <h2 className="text-xl" style={{ marginLeft: "16px", color: "#3f51b5", fontWeight: "bold" }}>
                        SKIN TYPES MANAGEMENT
                    </h2>
                </div>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <>
                        {renderTable()}
                    </>
                )}
            </div>
        </>
    );
};

export default SkinTypesManagement;