package com.example.studyapp.model;

import jakarta.persistence.*;
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

    // getter setter
}