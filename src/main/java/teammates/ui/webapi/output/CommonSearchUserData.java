package teammates.ui.webapi.output;

import javax.annotation.Nullable;

/**
 * Contains common attributes for the Student and Instructor search response
 * object.
 */
public class CommonSearchUserData {
    private final String name;
    private final String email;
    private final String courseId;

    @Nullable
    private final String googleId;

    public CommonSearchUserData(String name, String email, String courseId, String googleId) {
        this.name = name;
        this.email = email;
        this.courseId = courseId;
        this.googleId = googleId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getCourseId() {
        return courseId;
    }

    public String getGoogleId() {
        return googleId;
    }
}
