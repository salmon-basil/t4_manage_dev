package com.example.studyapp.model;

import jakarta.persistence.*;
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

    // getter setter
}
