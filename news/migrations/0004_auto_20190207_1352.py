# Generated by Django 2.1.5 on 2019-02-07 13:52

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0003_comments'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comments',
            name='date',
            field=models.DateTimeField(default=django.utils.timezone.now, editable=False),
        ),
    ]
