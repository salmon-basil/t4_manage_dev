package com.example.studyapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ユーザー名
    @Column(nullable = false)
    private String username;

    // パスワード
    @Column(nullable = false)
    private String password;

    // 総勉強時間
    private int totalStudyTime;

    // ランク情報
    @ManyToOne
    @JoinColumn(name = "rank_id")
    private Rank rank;

    // 勉強記録
    @OneToMany(mappedBy = "user")
    private List<StudyRecord> records;

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