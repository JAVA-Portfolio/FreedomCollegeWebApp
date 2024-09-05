package com.FreedomCollege.FreedomCollege.Service;

import com.FreedomCollege.FreedomCollege.Repository.StudentRepository;
import com.FreedomCollege.FreedomCollege.model.Student;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    private static final int OUR_NO = 1;
    private static int initialCount = 0;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Optional<Student> getStudentById(Long studentId) {
        return studentRepository.findById(studentId);
    }

    @Transactional
    public void deleteStudent(Long studentId) {
        studentRepository.deleteById(studentId);
    }

    public synchronized Long generatePreviewStudentNumber() {
        int yearSuffix = LocalDate.now().getYear() % 100;
        String newStudentNumber = String.format("%d%d%07d", OUR_NO, yearSuffix, initialCount + 1);
        return Long.parseLong(newStudentNumber);
    }

    public synchronized Long generateStudentNumber() {
        int yearSuffix = LocalDate.now().getYear() % 100;
        initialCount++;
        String newStudentNumber = String.format("%d%d%07d", OUR_NO, yearSuffix, initialCount);
        return Long.parseLong(newStudentNumber);
    }

    @Transactional
    public Student saveStudent(Student student) {
        student.setStudentId(generateStudentNumber());
        return studentRepository.save(student);
    }
}
