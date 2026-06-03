package com.example.studyapp.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "study_records")
public class StudyRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long recordId;

    // 科目
    private String subject;

    // 勉強時間
    private int studyTime;

    // 勉強日
    private LocalDate studyDate;

    // 学習カテゴリ
    private String category;

    // ユーザー情報
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // 作成日時
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // 更新日時
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // エンティティが作成されるときに自動的にcreatedAtを設定
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    // 更新されるときに自動的にupdatedAtを更新
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // getter setter
}