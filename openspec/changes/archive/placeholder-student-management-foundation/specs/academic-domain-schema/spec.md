## ADDED Requirements

### Requirement: Core academic entities are represented explicitly
The system MUST represent the core academic entities needed for the student
management domain: user, student, teacher, class, course, enrollment, grade,
and attendance.

#### Scenario: Domain schema is defined
- **WHEN** the persistence layer is initialized
- **THEN** the schema includes distinct entities for the core academic records
- **THEN** each entity has an identifier and lifecycle metadata appropriate for
  future auditing

### Requirement: Academic relationships preserve referential integrity
The system MUST preserve referential integrity between students, teachers,
classes, courses, enrollments, grade records, and attendance records.

#### Scenario: Grade record is created
- **WHEN** the system stores a new grade record
- **THEN** the record references a valid student and course context
- **THEN** the system rejects writes that point to missing related records

#### Scenario: Attendance record is created
- **WHEN** the system stores a new attendance record
- **THEN** the record references a valid student and session or date context
- **THEN** the system preserves the recorded attendance status

### Requirement: User identities map cleanly to domain roles
The system MUST map authenticated users to the domain roles and profiles needed
for authorization and application behavior.

#### Scenario: Student user is resolved
- **WHEN** the system loads an authenticated student identity
- **THEN** it can resolve the associated student profile
- **THEN** authorization logic can restrict access to the student's own records

#### Scenario: Teacher user is resolved
- **WHEN** the system loads an authenticated teacher identity
- **THEN** it can resolve the associated teacher profile or assignment context
- **THEN** authorization logic can evaluate teaching scope correctly

