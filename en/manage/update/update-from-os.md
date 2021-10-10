# Upgrade to donation version

If you were previously using the Community Edition of Cloudreve, you can upgrade to the Donation Edition after obtaining the Donation Edition while retaining your data.

### Replace the main program

Back up all data, upload and replace the donation master and licence files with the original Community Edition directory.

### Execute the upgrade script

Using Cloudreve's command line parameters, run the upgrade database script.

{% tabs %}
{% tab title="Linux" %}
```text
./cloudreve --database-script UpgradeToPro
```
{% endtab %}

{% tab title="Windows" %}
```text
cloudreve.exe --database-script UpgradeToPro
```
{% endtab %}
{% endtabs %}
