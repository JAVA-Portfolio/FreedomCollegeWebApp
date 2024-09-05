package com.FreedomCollege.FreedomCollege.Controller;


import com.FreedomCollege.FreedomCollege.Repository.StudentRepository;
import com.FreedomCollege.FreedomCollege.Service.StudentService;
import com.FreedomCollege.FreedomCollege.model.Student;
import com.FreedomCollege.FreedomCollege.model.SuccessResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.ui.Model;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    //DEPENDANCY INJECTION

    private final StudentRepository studentRepository;
    private final StudentService studentService;

    @Autowired
    public StudentController(StudentRepository studentRepository, StudentService studentService) {
        this.studentRepository = studentRepository;
        this.studentService = studentService;
    }
    //VIEW ALL STUDENTS IN THE DATABASE
    @GetMapping("/all")
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    // SEARCH FOR A SPECIFIC STUDENT

    @GetMapping("/search")
    public ResponseEntity<?> searchStudent(@RequestParam String query) {
        Long studentId;
        try {
            studentId = Long.valueOf(query);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid student ID format.");
        }

        Optional<Student> optionalStudent = studentService.getStudentById(studentId);

        if (optionalStudent.isPresent()) {
            Student student = optionalStudent.get();
            return ResponseEntity.ok().body(student);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found.");
        }
    }



    //UPDATE AND EXISTING STUDENT
    @PutMapping("/update/{studentId}")
    public ResponseEntity<Student> updateStudent(@PathVariable Long studentId, @RequestBody Student studentDetails) {
        Optional<Student> optionalStudent = studentService.getStudentById(studentId);
        if (optionalStudent.isPresent()) {
            Student student = optionalStudent.get();
            student.setName(studentDetails.getName());
            student.setEmail(studentDetails.getEmail());
            student.setPhoneNumber(studentDetails.getPhoneNumber());
            student.setBirthdate(studentDetails.getBirthdate());
            student.setGender(studentDetails.getGender());
            student.setMajor(studentDetails.getMajor());
            // Note: studentId is usually not updated, so this line is unnecessary
            // student.setStudentId(studentDetails.getStudentId());
            Student updatedStudent = studentService.saveStudent(student);
            return ResponseEntity.ok(updatedStudent);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }


    //DELETE A STUDENT FROM THE DATABASE
    @DeleteMapping("/delete/{studentId}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long studentId) {
        try {
            studentService.deleteStudent(studentId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
