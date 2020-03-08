package teammates.ui.webapi.output;

import java.util.List;
import java.util.stream.Collectors;

import teammates.common.datatransfer.attributes.InstructorAttributes;

/**
 * Contains Instructors search response object(s).
 */
public class SearchInstructorsData extends ApiOutput {
    private final List<SearchInstructorsInstructorData> instructors;

    public SearchInstructorsData(List<InstructorAttributes> instructors) {
        this.instructors = instructors.stream().map(SearchInstructorsInstructorData::new).collect(Collectors.toList());
    }

    public List<SearchInstructorsInstructorData> getInstructors() {
        return instructors;
    }
}
