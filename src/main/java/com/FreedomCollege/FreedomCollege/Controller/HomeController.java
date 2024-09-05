package com.FreedomCollege.FreedomCollege.Controller;

import com.FreedomCollege.FreedomCollege.Service.StudentService;
import com.FreedomCollege.FreedomCollege.model.Student;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping
public class HomeController {

    @Autowired
    private StudentService studentService;

    @GetMapping("/")
    public String home() {
        return "Home"; // This refers to HomePage.html in src/main/resources/templates
    }


    @GetMapping("/StudentManagement")
    public String showStudentManagementPage() {
        return "StudentManagement"; // this returns StudentManagement.html
    }


    // Show registration form
    @GetMapping("/register")
    public String showRegistrationForm(Model model) {
        Student student = new Student();
        student.setStudentId(studentService.generatePreviewStudentNumber()); // THIS LINE ENSURES THAT THE STUDENT NUMBER IS CREATED AND DISPLAYED ON THE FORM B4 SUBMITTING
        model.addAttribute("student", student);
        return "studentForm";
    }

    // Handle form submission
    @PostMapping("/register")
    public String submitStudentForm(@Valid @ModelAttribute Student student, BindingResult result, RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            redirectAttributes.addFlashAttribute("message", "Invalid input");
            return "redirect:/register";
        } else {
            Student savedStudent = studentService.saveStudent(student);
            redirectAttributes.addFlashAttribute("message", "Student saved successfully with ID: " + savedStudent.getStudentId());
            return "redirect:/result";
        }
    }


    // Show result page
    @GetMapping("/result")
    public String showResultPage(@ModelAttribute("message") String message, Model model) {
        model.addAttribute("message", message);
        return "result";
    }



    //this is used to save the student on the click button save, student management.html
    @GetMapping("/students/add")
    public String addStudentForm(Model model) {
        Student student = new Student();
        model.addAttribute("student", student);
        return "StudentManagement";
    }
}
