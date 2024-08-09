$(document).ready(function () {
    var form = $('#recommendationForm');
    var url = form.data('url'); // Retrieve URL from data attribute

    $('#recommendationForm').submit(function (event) {
        event.preventDefault();
        $('#errorMessage').hide();

        var toolName = $('#toolName').val();
        if (toolName.trim() === '') {
            $('#errorMessage').text('Tool name cannot be empty').show();
            return;
        }

        $.ajax({
            type: 'POST',
            url: url, // Use the URL from the data attribute
            data: {
                tool_name: toolName,
                csrfmiddlewaretoken: csrfToken // Use the CSRF token from the global variable
            },
            success: function (data) {
                $('#recommendationTable tbody').empty();
                var index = 1;
                $.each(data, function (toolKey, recommendations) {
                    $.each(recommendations, function (i, recommendation) {
                        $('#recommendationTable tbody').append(
                            `<tr>
                                <td>${index}</td>
                                <td>${recommendation.name}</td>
                                <td>${recommendation.use}</td>
                            </tr>`
                        );
                        index++;
                    });
                });
                $('#recommendationTable').show();
            },
            error: function (xhr) {
                var response = JSON.parse(xhr.responseText);
                $('#errorMessage').text(response.error).show();
            }
        });
    });

    $('#clearButton').click(function () {
        $('#errorMessage').hide();
        $('#recommendationTable tbody').empty();
        $('#recommendationTable').hide();
        $('#toolName').val('');
    });
});