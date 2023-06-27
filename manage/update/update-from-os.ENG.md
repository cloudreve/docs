# Upgrade to the donation version

If you previously used the community edition of Cloudreve, after obtaining the donation edition, you can upgrade to the donation edition while preserving your data.

### Replace the main program

Back up all data, upload and replace the donor moderator program and authorization files to the original community version directory.

### Execute the upgrade script

Using Cloudreve's command-line arguments, run the upgrade database script:

{% tabs %}
{% tab title="Linux" %}
```
./cloudreve --database-script OSSToPro
```
{% endtab %}

{% tab title="Windows" %}
```
cloudreve.exe --database-script OSSToPro
```
{% endtab %}
{% endtabs %}
