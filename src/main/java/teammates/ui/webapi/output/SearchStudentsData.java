package teammates.ui.webapi.output;

import java.util.List;
import java.util.stream.Collectors;

import teammates.common.datatransfer.attributes.StudentAttributes;

/**
 * Contains Students search response object(s).
 */
public class SearchStudentsData extends ApiOutput {
    private final List<SearchStudentsStudentData> students;

    public SearchStudentsData(List<StudentAttributes> students) {
        this.students = students.stream().map(SearchStudentsStudentData::new).collect(Collectors.toList());
    }

    public List<SearchStudentsStudentData> getStudents() {
        return students;
    }
}
