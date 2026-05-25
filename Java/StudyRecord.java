package com.example.studyapp.model;

import jakarta.persistence.*;
import java.time.LocalDate;

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

    // ユーザー情報
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // getter setter
}