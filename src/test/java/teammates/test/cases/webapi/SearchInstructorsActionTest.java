package teammates.test.cases.webapi;

import org.testng.annotations.Test;

import teammates.common.datatransfer.DataBundle;
import teammates.common.datatransfer.attributes.InstructorAttributes;
import teammates.common.util.Const;
import teammates.ui.webapi.action.JsonResult;
import teammates.ui.webapi.action.SearchInstructorsAction;
import teammates.ui.webapi.output.SearchInstructorsData;

/**
 * SUT: {@link SearchInstructorsAction}.
 */
public class SearchInstructorsActionTest extends BaseActionTest<SearchInstructorsAction> {

    private final InstructorAttributes acc = typicalBundle.instructors.get("instructor1OfCourse1");

    @Override
    protected void prepareTestData() {
        DataBundle dataBundle = getTypicalDataBundle();
        removeAndRestoreDataBundle(dataBundle);
        putDocuments(dataBundle);
    }

    @Override
    protected String getActionUri() {
        return Const.ResourceURIs.INSTRUCTORS_SEARCH;
    }

    @Override
    protected String getRequestMethod() {
        return GET;
    }

    @Override
    @Test
    protected void testExecute() {
        // See test cases below.
    }

    @Test
    protected void testExecute_notEnoughParameters_shouldFail() {
        loginAsAdmin();
        verifyHttpParameterFailure();
    }

    @Test
    protected void testExecute_searchCourseId_shouldSucceed() {
        loginAsAdmin();
        String[] submissionParams = new String[] { Const.ParamsNames.ADMIN_SEARCH_KEY, acc.getCourseId() };
        SearchInstructorsAction action = getAction(submissionParams);
        JsonResult result = getJsonResult(action);
        SearchInstructorsData response = (SearchInstructorsData) result.getOutput();
        assertTrue(response.getInstructors().stream()
                .filter(i -> i.getName().equals(acc.getName()))
                .findAny()
                .isPresent());
    }

    @Test
    protected void testExecute_searchDisplayedName_shouldSucceed() {
        loginAsAdmin();
        String[] submissionParams = new String[] { Const.ParamsNames.ADMIN_SEARCH_KEY, acc.getDisplayedName() };
        SearchInstructorsAction action = getAction(submissionParams);
        JsonResult result = getJsonResult(action);
        SearchInstructorsData response = (SearchInstructorsData) result.getOutput();
        assertTrue(response.getInstructors().stream()
                .filter(i -> i.getName().equals(acc.getName()))
                .findAny()
                .isPresent());
    }

    @Test
    protected void testExecute_searchEmail_shouldSucceed() {
        loginAsAdmin();
        String[] submissionParams = new String[] { Const.ParamsNames.ADMIN_SEARCH_KEY, acc.getEmail() };
        SearchInstructorsAction action = getAction(submissionParams);
        JsonResult result = getJsonResult(action);
        SearchInstructorsData response = (SearchInstructorsData) result.getOutput();
        assertTrue(response.getInstructors().stream()
                .filter(i -> i.getName().equals(acc.getName()))
                .findAny()
                .isPresent());
    }

    @Test
    protected void testExecute_searchGoogleId_shouldSucceed() {
        loginAsAdmin();
        String[] submissionParams = new String[] { Const.ParamsNames.ADMIN_SEARCH_KEY, acc.getGoogleId() };
        SearchInstructorsAction action = getAction(submissionParams);
        JsonResult result = getJsonResult(action);
        SearchInstructorsData response = (SearchInstructorsData) result.getOutput();
        assertTrue(response.getInstructors().stream()
                .filter(i -> i.getName().equals(acc.getName()))
                .findAny()
                .isPresent());
    }

    @Test
    protected void testExecute_searchName_shouldSucceed() {
        loginAsAdmin();
        String[] submissionParams = new String[] { Const.ParamsNames.ADMIN_SEARCH_KEY, acc.getName() };
        SearchInstructorsAction action = getAction(submissionParams);
        JsonResult result = getJsonResult(action);
        SearchInstructorsData response = (SearchInstructorsData) result.getOutput();
        assertTrue(response.getInstructors().stream()
                .filter(i -> i.getName().equals(acc.getName()))
                .findAny()
                .isPresent());
    }

    @Test
    protected void testExecute_searchNoMatch_shouldBeEmpty() {
        loginAsAdmin();
        String[] submissionParams = new String[] { Const.ParamsNames.ADMIN_SEARCH_KEY, "noMatch" };
        SearchInstructorsAction action = getAction(submissionParams);
        JsonResult result = getJsonResult(action);
        SearchInstructorsData response = (SearchInstructorsData) result.getOutput();
        assertEquals(0, response.getInstructors().size());
    }

    @Override
    @Test
    protected void testAccessControl() {
        verifyOnlyAdminCanAccess();
    }

}
