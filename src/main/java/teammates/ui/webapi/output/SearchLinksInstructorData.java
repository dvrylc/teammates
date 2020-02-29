package teammates.ui.webapi.output;

/**
 * Contains the links for an instructor.
 */
public class SearchLinksInstructorData {
    private String email;
    private String manageAccountLink;
    private String homePageLink;
    private String courseJoinLink;
    private String recordsPageLink;

    public SearchLinksInstructorData() {
        this.email = null;
        this.manageAccountLink = null;
        this.homePageLink = null;
        this.courseJoinLink = null;
        this.recordsPageLink = null;
    }

    public SearchLinksInstructorData(
            String email,
            String manageAccountLink,
            String homePageLink,
            String courseJoinLink,
            String recordsPageLink
    ) {
        this.email = email;
        this.manageAccountLink = manageAccountLink;
        this.homePageLink = homePageLink;
        this.courseJoinLink = courseJoinLink;
        this.recordsPageLink = recordsPageLink;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setManageAccountLink(String manageAccountLink) {
        this.manageAccountLink = manageAccountLink;
    }

    public void setHomePageLink(String homePageLink) {
        this.homePageLink = homePageLink;
    }

    public void setCourseJoinLink(String courseJoinLink) {
        this.courseJoinLink = courseJoinLink;
    }

    public void setRecordsPageLink(String recordsPageLink) {
        this.recordsPageLink = recordsPageLink;
    }

    public String getEmail() {
        return email;
    }

    public String getManageAccountLink() {
        return manageAccountLink;
    }

    public String getHomePageLink() {
        return homePageLink;
    }

    public String getCourseJoinLink() {
        return courseJoinLink;
    }

    public String getRecordsPageLink() {
        return recordsPageLink;
    }
}

