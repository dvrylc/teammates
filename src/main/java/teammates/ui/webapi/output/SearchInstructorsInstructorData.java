package teammates.ui.webapi.output;

import teammates.common.datatransfer.attributes.InstructorAttributes;

/**
 * Contains attributes for the Instructors search respoonse object.
 */
public class SearchInstructorsInstructorData extends CommonSearchUserData {
    public SearchInstructorsInstructorData(InstructorAttributes instructorAttributes) {
        super(instructorAttributes.getName(), instructorAttributes.getEmail(), instructorAttributes.getCourseId(),
                instructorAttributes.getGoogleId());
    }
}
