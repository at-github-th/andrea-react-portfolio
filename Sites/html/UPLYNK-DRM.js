jwplayer('uplynk').setup({
      playlist: [{
        sources: [{
              file: 'content-url.m3u8',
                drm: {
                  fairplay: {
                    certificateUrl: 'path/certificate.der',
                    extractContentId: function(initDataUri) {
                      var link = document.createElement('a');
                      link.href = getSPCUrl(initDataUri);
                      var query = link.search.substr(1);
                      var id = query.split("&");
                      var item = id[0].split("=");
                      var cid = item[1];
                      return cid;
                    },
                    processSpcUrl: getSPCUrl,
                    licenseResponseType: 'json',
                    licenseRequestMessage: function(message, session) {
                      var payload = {};
                      payload.spc = base64EncodeUint8Array(message);
                      payload.assetId = session.contentId;
                      return JSON.stringify(payload);
                    },
                    extractKey: function(response) {
                      return response.ckc;
                    }
                  }
                }
              }]
            }]
      });

      function getSPCUrl(initDataUri) {
        var spcurl = initDataUri.replace('skd://', 'https://');
        spcurl = spcurl.substring(1, spcurl.length);
        return spcurl;
      }

      function base64EncodeUint8Array(input) {
        var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        while (i < input.length) {
          chr1 = input[i++];
          chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index
          chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

          enc1 = chr1 >> 2;
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
          enc4 = chr3 & 63;

          if (isNaN(chr2)) {
            enc3 = enc4 = 64;
          } else if (isNaN(chr3)) {
            enc4 = 64;
          }
          output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                  keyStr.charAt(enc3) + keyStr.charAt(enc4);
        }
        return output;
      }