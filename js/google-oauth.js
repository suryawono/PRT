var accessToken;

var googleapi = {
    authorize: function (options) {
        var deferred = $.Deferred();

        //Build the OAuth consent page URL
        var authUrl = 'https://accounts.google.com/o/oauth2/auth?' + $.param({
            client_id: options.client_id,
            redirect_uri: options.redirect_uri,
            response_type: 'code',
            scope: options.scope

        });

        //Open the OAuth consent page in the InAppBrowser
        var authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');

        //The recommendation is to use the redirect_uri "urn:ietf:wg:oauth:2.0:oob"
        //which sets the authorization code in the browser's title. However, we can't
        //access the title of the InAppBrowser.
        //
        //Instead, we pass a bogus redirect_uri of "http://localhost", which means the
        //authorization code will get set in the url. We can access the url in the
        //loadstart and loadstop events. So if we bind the loadstart event, we can
        //find the authorization code and close the InAppBrowser after the user
        //has granted us access to their data.
        $(authWindow).on('loadstart', function (e) {
            var url = e.originalEvent.url;
            var code = /\?code=(.+)$/.exec(url);
            var error = /\?error=(.+)$/.exec(url);

            if (code || error) {
                //Always close the browser when match is found
                authWindow.close();
            }

            if (code) {
                //Exchange the authorization code for an access token
                $.post('https://accounts.google.com/o/oauth2/token', {
                    code: code[1],
                    client_id: options.client_id,
                    client_secret: options.client_secret,
                    redirect_uri: options.redirect_uri,
                    grant_type: 'authorization_code'
                }).done(function (data) {
                    deferred.resolve(data);

                    $("#loginStatus").html('Name: ' + data.given_name);
                }).fail(function (response) {
                    deferred.reject(response.responseJSON);
                });
            } else if (error) {
                //The user denied access to the app
                deferred.reject({
                    error: error[1]
                });
            }
        });

        return deferred.promise();
    }
};

function callGoogle()
{

    //  alert('starting');
    googleapi.authorize({
        client_id: '970033667558-niv2oshnhf67cdajemqtjv8o5b0atfeq.apps.googleusercontent.com',
        client_secret: 'KJP1uxd66_mI1Jiz85aA7VOu',
        redirect_uri: 'http://localhost',
        scope: 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email'
    }).done(function (data) {
        accessToken = data.access_token;
        refreshToken = data.refresh_token;
        getDataProfile();


    });

}
// This function gets data of user.
var dataLogin = null;
function getDataProfile()
{
    var term = null;
    $.ajax({
        url: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + accessToken,
        type: 'GET',
        data: term,
        dataType: 'json',
        error: function (jqXHR, text_status, strError) {
        },
        success: function (data)
        {
            $.ajax({
                url: service_url + "anggotas/login.json",
                type: "POST",
                data: {accessToken: accessToken, gmailID: data.id, email: data.email, name: data.name, ppLink: data.picture, gender: data.gender},
                dataType: "JSON",
                success: function (data) {
                    dataLogin = data;
                    if (data.response.status == 202) {
                        loginSuccess(data.response.data);
                        console.log("login success");
                    } else {
                        alert("Login gagal");
                        console.log("login fail");
                    }
                },
            })
        }
    });
}
function disconnectUser() {
    var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token=' + accessToken;

    // Perform an asynchronous GET request.
    $.ajax({
        type: 'GET',
        url: revokeUrl,
        async: false,
        contentType: "application/json",
        dataType: 'jsonp',
        success: function (nullResponse) {
            // Do something now that user is disconnected
            // The response is always undefined.
            console.log(JSON.stringify(nullResponse));
            console.log("-----signed out..!!----" + accessToken);
            accessToken = null;
            refreshToken = null;

        },
        error: function (e) {
            // Handle the error
            // console.log(e);
            // You could point users to manually disconnect if unsuccessful
            // https://plus.google.com/apps
        }
    });
}