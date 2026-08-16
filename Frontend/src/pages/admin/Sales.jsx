import { useEffect, useMemo, useState } from "react";

import {
    Alert,
    Box,
    CircularProgress
} from "@mui/material";

import {
    getSales
} from "../../services/saleService";

import SaleToolbar from "../../components/sales/SaleToolbar";
import SaleTable from "../../components/sales/SaleTable";
import SaleDialog from "../../components/sales/SaleDialog";

function Sales() {

    const [sales, setSales] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [searchTerm, setSearchTerm] =
        useState("");

    const [dialogOpen, setDialogOpen] =
        useState(false);


    /*
     |--------------------------------------------------------------------------
     | Load Sales
     |--------------------------------------------------------------------------
     */

    const loadSales = async () => {

        try {

            setLoading(true);

            const data =
                await getSales();

            setSales(data);

            setError("");

        } catch (error) {

            console.error(
                "LOAD SALES ERROR:",
                error
            );

            setError(
                "Unable to load sales."
            );

        } finally {

            setLoading(false);

        }

    };


    /*
     |--------------------------------------------------------------------------
     | Initial Load
     |--------------------------------------------------------------------------
     */

    useEffect(() => {

        const timer =
            setTimeout(() => {

                loadSales();

            }, 0);

        return () =>
            clearTimeout(timer);

    }, []);


    /*
     |--------------------------------------------------------------------------
     | Filter Sales
     |--------------------------------------------------------------------------
     */

    const filteredSales =
        useMemo(() => {

            const search =
                searchTerm
                    .trim()
                    .toLowerCase();

            if (!search) {
                return sales;
            }

            return sales.filter(
                (sale) => {

                    const medicineName =
                        sale.medicineName
                            ?.toLowerCase() || "";

                    const batchNumber =
                        sale.batchNumber
                            ?.toLowerCase() || "";

                    const customerName =
                        sale.customerName
                            ?.toLowerCase() || "";

                    const soldBy =
                        sale.soldBy
                            ?.toLowerCase() || "";

                    const category =
                        sale.category
                            ?.toLowerCase() || "";


                    return (

                        medicineName
                            .includes(search)

                        ||

                        batchNumber
                            .includes(search)

                        ||

                        customerName
                            .includes(search)

                        ||

                        soldBy
                            .includes(search)

                        ||

                        category
                            .includes(search)

                    );

                }
            );

        }, [
            sales,
            searchTerm
        ]);


    /*
     |--------------------------------------------------------------------------
     | Render
     |--------------------------------------------------------------------------
     */

    return (

        <Box>

            {error && (

                <Alert
                    severity="error"
                    sx={{
                        mb: 3
                    }}
                >

                    {error}

                </Alert>

            )}


            <SaleToolbar

                searchTerm={
                    searchTerm
                }

                onSearchChange={
                    setSearchTerm
                }

                onAdd={() =>
                    setDialogOpen(true)
                }

            />


            {loading ? (

                <Box
                    display="flex"
                    justifyContent="center"
                    mt={5}
                >

                    <CircularProgress />

                </Box>

            ) : (

                <SaleTable

                    sales={
                        filteredSales
                    }

                />

            )}


            <SaleDialog

                open={
                    dialogOpen
                }

                onClose={() =>
                    setDialogOpen(false)
                }

                refreshSales={
                    loadSales
                }

            />

        </Box>

    );

}

export default Sales;