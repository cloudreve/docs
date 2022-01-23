# Upgrade to Donation Edition

If you were previously using the Community Edition of Cloudreve, you can upgrade to the Donation Edition after obtaining the Donation Edition while retaining your data.

### Replace the main program

Back up all data, upload and replace the main program and license files of the Donation Edition to the original Community Edition directory.

### Execute the upgrade script

Using Cloudreve's command line parameters, run the upgrade database script.

{% tabs %}
{% tab title="Linux" %}
```
./cloudreve --database-script OSSToPro
```
{% endtab %}

{% tab title="Windows" %}
```
cloudreve.exe --database-script UpgradeToPro
```
{% endtab %}
{% endtabs %}
