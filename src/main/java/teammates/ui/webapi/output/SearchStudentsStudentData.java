package teammates.ui.webapi.output;

import javax.annotation.Nullable;

import teammates.common.datatransfer.attributes.StudentAttributes;

/**
 * Contains attributes for the Students search respoonse object.
 */
public class SearchStudentsStudentData extends CommonSearchUserData {
    private final String team;
    private final String section;
    private final JoinState joinState;

    @Nullable
    private final String comments;

    public SearchStudentsStudentData(StudentAttributes studentAttributes) {
        super(studentAttributes.getName(), studentAttributes.getEmail(), studentAttributes.getCourse(),
                studentAttributes.getGoogleId());
        this.comments = studentAttributes.getComments();
        this.team = studentAttributes.getTeam();
        this.section = studentAttributes.getSection();
        this.joinState = studentAttributes.isRegistered() ? JoinState.JOINED : JoinState.NOT_JOINED;
    }

    public String getComments() {
        return comments;
    }

    public String getTeam() {
        return team;
    }

    public String getSection() {
        return section;
    }

    public JoinState getJoinState() {
        return joinState;
    }
}
