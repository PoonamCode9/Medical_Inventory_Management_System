package com.medistock.backend.service;

import com.medistock.backend.exception.ResourceNotFoundException;
import com.medistock.backend.model.Category;
import com.medistock.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private AuditLogService auditLogService;

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    @Override
    public Category createCategory(Category category) {
        Category saved = categoryRepository.save(category);
        auditLogService.logAction("CREATE_CATEGORY", "Created category: " + category.getName());
        return saved;
    }

    @Override
    public Category updateCategory(Long id, Category category) {
        Category existing = getCategoryById(id);
        existing.setName(category.getName());
        existing.setDescription(category.getDescription());
        Category saved = categoryRepository.save(existing);
        auditLogService.logAction("UPDATE_CATEGORY", "Updated category: " + category.getName());
        return saved;
    }

    @Override
    public void deleteCategory(Long id) {
        Category existing = getCategoryById(id);
        categoryRepository.delete(existing);
        auditLogService.logAction("DELETE_CATEGORY", "Deleted category: " + existing.getName());
    }
}
