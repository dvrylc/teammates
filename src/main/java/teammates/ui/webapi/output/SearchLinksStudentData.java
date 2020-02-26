package teammates.ui.webapi.output;

/**
 * Contains the links for a student.
 */
public class SearchLinksStudentData {
    private String googleId;
    private String manageAccountLink;
    private String homePageLink;
    private String courseJoinLink;
    private String recordsPageLink;

    public SearchLinksStudentData() {
        this.googleId = null;
        this.manageAccountLink = null;
        this.homePageLink = null;
        this.courseJoinLink = null;
        this.recordsPageLink = null;
    }

    public SearchLinksStudentData(
            String googleId,
            String manageAccountLink,
            String homePageLink,
            String courseJoinLink,
            String recordsPageLink
    ) {
        this.googleId = googleId;
        this.manageAccountLink = manageAccountLink;
        this.homePageLink = homePageLink;
        this.courseJoinLink = courseJoinLink;
        this.recordsPageLink = recordsPageLink;
    }
    
    public void setGoogleId(String googleId) {
        this.googleId = googleId;
    }

    public void setManageAccountLink(String manageAccountLink) {
        this.manageAccountLink = manageAccountLink;
    }

    public void setHomePageLink(String homePageLink) {
        this.homePageLink = homePageLink;
    }

    public void setCourseJoinLink(String courseJoinLink) {
        this. courseJoinLink = courseJoinLink;
    }

    public void setRecordsPageLink(String recordsPageLink) {
        this.recordsPageLink = recordsPageLink;
    }

    public String getGoogleId() {
        return googleId;
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

    public String  getRecordsPageLink() {
        return recordsPageLink;
    }
}

