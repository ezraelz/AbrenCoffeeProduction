# Generated by Django 5.1.3 on 2025-06-25 17:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0006_alter_comments_blog'),
    ]

    operations = [
        migrations.RenameField(
            model_name='comments',
            old_name='session_key',
            new_name='guest_session_id',
        ),
    ]
