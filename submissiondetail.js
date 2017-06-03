$(document).ready(function () {
    if ($("#ReviewEntryForm").length) enhanceReviewPanel();
})
$(document).ajaxComplete(function (event, xhr, settings) {
    if (settings.url.indexOf("/submissions/details_reviewform") != -1) {
        enhanceReviewPanel();
    }
});

function enhanceReviewPanel() {
    if($("#ReviewEntryForm").hasClass("egj-enhanced")) return;
    $("#ReviewEntryForm").submit(function (e) {
        e.preventDefault()
    });
    $("#finalize-review").before($("#finalize-review").clone().attr("id", "finalize-review-override").text("Finished")).hide();
    $("#review-form-panel a[title='Download Review']").hide();
    // if ($("#next-submission").length) {
    //     $("#next-submission").clone().toggleClass("inline-block btn btn-primary pull-right").css("font-size", "15px").insertBefore("#save-draft-review").children("span").attr("style", "font-size:15px!important")
    // }
    // if ($("#prev-submission").length) {
    //     $("#prev-submission").clone().toggleClass("inline-block btn btn-primary pull-right").css("font-size", "15px").insertBefore("#save-draft-review").children("span").attr("style", "font-size:15px!important")
    // }
    if ($("div[data-label-id='5257453']").length) {
        $("#ReviewEntryForm label:contains(Submitter Notes)").append('<span>Optional</span>');
    } else {
        $("#ReviewEntryForm label:contains(Submitter Notes)").append('<span class="required" aria-required="true">*</span>').nextAll("textarea").addClass("required").attr("aria-required", "true");
    }

    $("#finalize-review-override").on("click", function () {
        $("#ReviewEntryForm").validate();
        if (!$("#ReviewEntryForm").valid()) {
            $(".input-validation-error").first().focus();
            return
        }
        var submitterNotes = $("#ReviewEntryForm label:contains(Submitter Notes)").nextAll("textarea").val();
        if (submitterNotes) {
            $("#NoteText").val("[Submitter] " + submitterNotes);
            $("input[type=hidden]#Visibility").val("Entire Team");
            $("#comment-form button.btn-primary").click()
        }
        var teamNotes = $("#ReviewEntryForm label:contains(Team Notes)").nextAll("textarea").val();
        if (teamNotes) {
            $("#NoteText").val("[Team] " + teamNotes);
            $("input[type=hidden]#Visibility").val("Entire Team");
            $("#comment-form button.btn-primary").click()
        }
        var vote = $("input[type=radio][value='Yes:1']").is(":checked") ? "1" : "2";
        var url = "/submissions/vote/" + $("#SubmissionID").val() + "?vote=" + vote;
        $.get(url, function () {
            $("#finalize-review-override").toggleClass("btn-default btn-primary").text("Submitted");
            SBM.StartLoading("Saving review...");
            $(".field-required.field-hidden").remove();
            var formpost = $("#ReviewEntryForm").serialize();
            $.ajax({
                type: "POST",
                url: "/submissions/details_reviewform",
                data: formpost + "&isFinalized=" + true,
                success: function (data) {
                    if (data) {
                        $("a[href='#activity-panel']").click();
                        if ($("#hist-filter-notes").length) {
                            $("#hist-filter-notes").click()
                        }
                    } else {
                        SBM.StopLoading();
                        SBM.ShowNotification("There was a problem saving your review form. Please try again.", "error")
                    }
                },
                dataType: "json"
            })
        })
    });
 $("#ReviewEntryForm").addClass("egj-enhanced");
}
