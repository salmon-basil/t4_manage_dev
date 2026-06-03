package com.example.studyapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "ranks")
public class Rank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rankId;

    // ランク名
    @Column(nullable = false)
    private String rankName;

    // このランクのユーザー一覧
    @OneToMany(mappedBy = "rank")
    private List<User> users;

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
