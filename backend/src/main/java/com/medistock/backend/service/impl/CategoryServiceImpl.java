package com.medistock.backend.service.impl;

import com.medistock.backend.entity.Category;
import com.medistock.backend.exception.DuplicateResourceException;
import com.medistock.backend.exception.ResourceNotFoundException;
import com.medistock.backend.repository.CategoryRepository;
import com.medistock.backend.service.CategoryService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @PostConstruct
    @Transactional
    public void seedCategories() {
        if (categoryRepository.count() == 0) {
            categoryRepository.save(Category.builder().categoryName("Antibiotics").description("Bacterial infection medicines").build());
            categoryRepository.save(Category.builder().categoryName("Analgesics").description("Pain relievers and NSAIDs").build());
            categoryRepository.save(Category.builder().categoryName("Vitamins").description("Dietary supplements and vitamins").build());
            categoryRepository.save(Category.builder().categoryName("Cardiovascular").description("Heart and blood pressure treatments").build());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Category getCategoryById(Integer id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
    }

    @Override
    @Transactional
    public Category createCategory(Category category) {
        if (category.getCategoryName() != null) {
            category.setCategoryName(category.getCategoryName().trim());
        }
        validateCategory(category, null);
        return categoryRepository.save(category);
    }

    @Override
    @Transactional
    public Category updateCategory(Integer id, Category categoryDetails) {
        Category category = getCategoryById(id);
        if (categoryDetails.getCategoryName() != null) {
            categoryDetails.setCategoryName(categoryDetails.getCategoryName().trim());
        }
        validateCategory(categoryDetails, id);
        
        category.setCategoryName(categoryDetails.getCategoryName());
        category.setDescription(categoryDetails.getDescription());
        return categoryRepository.save(category);
    }

    @Override
    @Transactional
    public void deleteCategory(Integer id) {
        Category category = getCategoryById(id);
        categoryRepository.delete(category);
    }

    private void validateCategory(Category category, Integer updateId) {
        if (category.getCategoryName() == null || category.getCategoryName().isEmpty()) {
            throw new IllegalArgumentException("Category Name is required.");
        }

        // Unique category name check
        Optional<Category> existing = categoryRepository.findByCategoryName(category.getCategoryName());
        if (existing.isPresent() && (updateId == null || !existing.get().getCategoryId().equals(updateId))) {
            throw new DuplicateResourceException("Category already exists.");
        }
    }
}
