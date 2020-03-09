package teammates.ui.webapi.output;

import java.util.List;

/**
 * Data when searching for courses.
 */
public class SearchCoursesResult extends ApiOutput {
    private List<SearchCourseData> students;
    private List<SearchCourseData> instructors;

    public SearchCoursesResult(List<SearchCourseData> students,
            List<SearchCourseData> instructors) {
        this.students = students;
        this.instructors = instructors;
    }

    public List<SearchCourseData> getStudents() {
        return students;
    }

    public List<SearchCourseData> getInstructors() {
        return instructors;
    }
}
