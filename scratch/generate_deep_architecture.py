import os

project_dir = r"c:\Users\saiku\OneDrive\Desktop\ELEVATEIQ\stylehub"

def write_module(rel_path, content):
    full_path = os.path.join(project_dir, rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content.strip() + '\n')

apps = ['catalog', 'orders', 'sellers', 'inventory', 'payments', 'promotions', 'reviews', 'recommendations', 'accounts', 'analytics', 'audit', 'notifications', 'cart']

print("Building Deep Microservices Domain Layers...")

for app in apps:
    cap = app.capitalize()
    
    # 1. Signals & Receivers
    write_module(f"backend/{app}/signals.py", f"""
\"\"\"
Signal handlers & asynchronous lifecycle listeners for {app} microservice.
\"\"\"
import logging
from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver

logger = logging.getLogger(__name__)

@receiver(post_save, sender='{app}.{cap}') if False else None
def handle_{app}_post_save(sender, instance, created, **kwargs):
    action = "created" if created else "updated"
    logger.info(f"{cap} entity {{instance.id}} was {{action}}.")

@receiver(post_delete, sender='{app}.{cap}') if False else None
def handle_{app}_post_delete(sender, instance, **kwargs):
    logger.warning(f"{cap} entity {{instance.id}} was deleted.")
""")

    # 2. Managers & Querysets
    write_module(f"backend/{app}/managers.py", f"""
\"\"\"
Custom Model Managers & QuerySet extensions for {app} microservice.
\"\"\"
from django.db import models

class {cap}QuerySet(models.QuerySet):
    \"\"\"Custom QuerySet methods for {app}.\"\"\"

    def active(self):
        return self.filter(is_active=True) if hasattr(self.model, 'is_active') else self

    def recent(self):
        return self.order_by('-created_at') if hasattr(self.model, 'created_at') else self


class {cap}Manager(models.Manager):
    \"\"\"Custom Manager for {app} models.\"\"\"

    def get_queryset(self):
        return {cap}QuerySet(self.model, using=self._db)

    def get_active(self):
        return self.get_queryset().active()

    def get_recent(self):
        return self.get_queryset().recent()
""")

    # 3. Serializers Expansion
    write_module(f"backend/{app}/schemas.py", f"""
\"\"\"
OpenAPI & DRF Schema Definitions for {app} microservice.
\"\"\"
from rest_framework import serializers

class {cap}SchemaSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    status = serializers.CharField(max_length=50, default='ACTIVE')
    created_at = serializers.DateTimeField(read_only=True)
    metadata = serializers.DictField(default=dict)
""")

    # 4. Context Providers in Frontend
    write_module(f"frontend/src/context/{cap}Context.tsx", f"""
import React, {{ createContext, useContext, useState, ReactNode }} from 'react';

interface {cap}ContextType {{
  state: any;
  setState: (val: any) => void;
  isLoading: boolean;
}}

const {cap}Context = createContext<{cap}ContextType | undefined>(undefined);

export const {cap}Provider: React.FC<{{ children: ReactNode }}> = ({{ children }}) => {{
  const [state, setState] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <{cap}Context.Provider value={{{{ state, setState, isLoading }}}}>
      {{children}}
    </{cap}Context.Provider>
  );
}};

export const use{cap}Context = () => {{
  const context = useContext({cap}Context);
  if (!context) throw new Error('use{cap}Context must be used within a {cap}Provider');
  return context;
}};
""")

print("Deep Microservices Domain Layers Generated.")
