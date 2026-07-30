package com.medistock.backend.service;

import com.medistock.backend.dto.DashboardDTO;
import com.medistock.backend.model.Inventory;
import com.medistock.backend.model.Medicine;
import com.medistock.backend.model.Supplier;
import com.medistock.backend.repository.InventoryRepository;
import com.medistock.backend.repository.MedicineRepository;
import com.medistock.backend.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ChatServiceImpl implements ChatService {

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private DashboardService dashboardService;

    @Override
    public String processMessage(String message) {
        String msg = message.toLowerCase().trim();

        // 1. Dashboard summary
        if (msg.contains("dashboard") || msg.contains("status") || msg.contains("summary") || msg.equals("hi") || msg.equals("hello")) {
            DashboardDTO data = dashboardService.getDashboardData();
            return "### MediStock Shop Summary 📊\n" +
                    "Here is a quick snapshot of the inventory status:\n\n" +
                    "- **Inventory Value:** ₹" + data.getInventoryValue() + "\n" +
                    "- **Today's Revenue:** ₹" + data.getTodayRevenue() + "\n" +
                    "- **Monthly Revenue:** ₹" + data.getMonthlyRevenue() + "\n" +
                    "- **Low Stock Items:** " + data.getLowStockCount() + " medicine(s)\n" +
                    "- **Expiring Batches (within 90 days):** " + data.getExpiringCount() + " batch(es)\n" +
                    "- **Total Medicines in Catalog:** " + data.getTotalMedicines() + "\n\n" +
                    "Let me know if you'd like to check low stock alerts or search for a specific medicine!";
        }

        // 2. Low stock alert
        if (msg.contains("low stock") || msg.contains("stock alert") || msg.contains("below limit")) {
            List<Medicine> lowStock = medicineRepository.findLowStockMedicines();
            if (lowStock.isEmpty()) {
                return "Good news! All medicines are well-stocked. There are no low stock alerts.";
            }
            StringBuilder sb = new StringBuilder("### Low Stock Alerts ⚠️\n\n| Medicine | Current Stock | Alert Level | Supplier |\n| --- | --- | --- | --- |\n");
            for (Medicine m : lowStock) {
                sb.append("| ").append(m.getName())
                  .append(" | ").append(m.getStockQuantity())
                  .append(" | ").append(m.getMinStockAlert())
                  .append(" | ").append(m.getSupplier() != null ? m.getSupplier().getName() : "N/A")
                  .append(" |\n");
            }
            return sb.toString();
        }

        // 3. Expiry check
        if (msg.contains("expir") || msg.contains("expired")) {
            List<Inventory> expiring = inventoryRepository.findExpiringSoon(LocalDate.now().plusDays(90));
            if (expiring.isEmpty()) {
                return "Excellent! No batches are expiring in the next 90 days.";
            }
            StringBuilder sb = new StringBuilder("### Expiring Batches (Next 90 Days) 📅\n\n");
            for (Inventory i : expiring) {
                sb.append("- **").append(i.getMedicine().getName()).append("** (Batch: `").append(i.getBatchNumber()).append("`) expires on **").append(i.getExpiryDate()).append("** (Qty left: ").append(i.getQuantity()).append(")\n");
            }
            return sb.toString();
        }

        // 4. Inventory Value
        if (msg.contains("inventory value") || msg.contains("stock value") || msg.contains("total value")) {
            DashboardDTO data = dashboardService.getDashboardData();
            return "The current **total inventory value** is **₹" + data.getInventoryValue() + "** (cost basis).";
        }

        // 5. Today's Revenue
        if (msg.contains("today's revenue") || msg.contains("sales today") || msg.contains("revenue today") || msg.contains("sold today")) {
            DashboardDTO data = dashboardService.getDashboardData();
            return "Today's **sales revenue** stands at **₹" + data.getTodayRevenue() + "**.";
        }

        // 6. Monthly Revenue
        if (msg.contains("monthly revenue") || msg.contains("revenue this month") || msg.contains("month sales")) {
            DashboardDTO data = dashboardService.getDashboardData();
            return "This month's **total revenue** is **₹" + data.getMonthlyRevenue() + "**.";
        }

        // 7. Restocking suggestions
        if (msg.contains("restock") || msg.contains("suggestion") || msg.contains("order list")) {
            List<Medicine> lowStock = medicineRepository.findLowStockMedicines();
            if (lowStock.isEmpty()) {
                return "Everything is sufficiently stocked. No restocking suggestions needed!";
            }
            StringBuilder sb = new StringBuilder("### Restocking Recommendations 🛒\n\n");
            for (Medicine m : lowStock) {
                int suggestedOrder = m.getMinStockAlert() * 3 - m.getStockQuantity();
                if (suggestedOrder < 50) suggestedOrder = 50; // Order minimum batch size
                sb.append("- **").append(m.getName()).append("**: Suggested order **").append(suggestedOrder).append(" units** from **").append(m.getSupplier() != null ? m.getSupplier().getName() : "N/A").append("** (Current stock: ").append(m.getStockQuantity()).append(")\n");
            }
            return sb.toString();
        }

        // 8. Search medicine specific
        if (msg.contains("search ") || msg.contains("find ") || msg.contains("stock of ") || msg.contains("is ") && msg.contains("in stock")) {
            String medQuery = msg.replace("search ", "")
                                .replace("find ", "")
                                .replace("stock of ", "")
                                .replace("is ", "")
                                .replace("in stock", "")
                                .replace("?", "")
                                .trim();

            List<Medicine> results = medicineRepository.findByNameContainingIgnoreCaseOrGenericNameContainingIgnoreCase(medQuery, medQuery);
            if (results.isEmpty()) {
                return "I couldn't find any medicine matching '" + medQuery + "' in our inventory. Try another name!";
            }

            StringBuilder sb = new StringBuilder("### Search Results 🔍\n\n");
            for (Medicine m : results) {
                sb.append("#### ").append(m.getName()).append("\n")
                  .append("- **Generic Formula:** ").append(m.getGenericName()).append("\n")
                  .append("- **Available Stock:** ").append(m.getStockQuantity()).append(" unit(s)\n")
                  .append("- **Retail Price:** ₹").append(m.getSellingPrice()).append("\n")
                  .append("- **Supplier:** ").append(m.getSupplier() != null ? m.getSupplier().getName() : "N/A").append("\n");

                List<Inventory> batches = inventoryRepository.findByMedicineId(m.getId());
                if (!batches.isEmpty()) {
                    sb.append("- **Active Batches:**\n");
                    for (Inventory b : batches) {
                        sb.append("  - Batch `").append(b.getBatchNumber()).append("` (Qty: ").append(b.getQuantity()).append(", Expiry: ").append(b.getExpiryDate()).append(", Loc: ").append(b.getLocation() != null ? b.getLocation() : "Shelf").append(")\n");
                    }
                }
                sb.append("\n");
            }
            return sb.toString();
        }

        // 9. Supplier info
        if (msg.contains("supplier") || msg.contains("who supplies")) {
            // Check if asking for specific medicine supplier
            boolean foundMed = false;
            for (Medicine m : medicineRepository.findAll()) {
                if (msg.contains(m.getName().toLowerCase()) || msg.contains(m.getGenericName().toLowerCase())) {
                    foundMed = true;
                    Supplier s = m.getSupplier();
                    if (s != null) {
                        return "### Supplier Info for " + m.getName() + " 🏢\n\n" +
                                "- **Supplier:** " + s.getName() + "\n" +
                                "- **Contact Person:** " + s.getContactPerson() + "\n" +
                                "- **Email:** " + s.getEmail() + "\n" +
                                "- **Phone:** " + s.getPhone() + "\n" +
                                "- **Address:** " + s.getAddress();
                    } else {
                        return "No supplier is assigned to " + m.getName() + ".";
                    }
                }
            }

            // List all suppliers if general lookup
            List<Supplier> suppliers = supplierRepository.findAll();
            if (suppliers.isEmpty()) {
                return "There are no suppliers registered in the database.";
            }
            StringBuilder sb = new StringBuilder("### Registered Suppliers list 🏢\n\n");
            for (Supplier s : suppliers) {
                sb.append("- **").append(s.getName()).append("** (Contact: ").append(s.getContactPerson()).append(", Phone: ").append(s.getPhone()).append(", Email: ").append(s.getEmail()).append(")\n");
            }
            return sb.toString();
        }

        // Fallback info help message
        return "Hello! I am the **MediStock AI Inventory Assistant**. I can help you query real-time database details. Try asking me:\n\n" +
                "1. 📊 *\"Give me a dashboard summary\"* - Current stats, revenue & alerts\n" +
                "2. ⚠️ *\"Show low stock alerts\"* - Medicines below threshold\n" +
                "3. 📅 *\"Show expiring batches\"* - Expirations in the next 90 days\n" +
                "4. 🔍 *\"Search Paracetamol\"* or *\"Stock of Amoxicillin\"* - Search quantity & prices\n" +
                "5. 🏢 *\"Supplier of Paracetamol\"* or *\"List suppliers\"* - Supplier contact lookup\n" +
                "6. 🛒 *\"What should we restock?\"* - Restock order quantities\n" +
                "7. 💰 *\"What is the inventory value?\"* or *\"Revenue today\"*";
    }
}
