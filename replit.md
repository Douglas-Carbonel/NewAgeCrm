# CRM/Project Management System

## Overview

This is a comprehensive CRM and project management application built with a modern full-stack architecture. The system manages clients, projects, tasks, contracts, and invoicing in an integrated business workflow. It provides a dashboard-driven interface for tracking project progress, managing client relationships, and handling financial operations.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Schema Validation**: Zod for runtime type checking
- **Session Management**: connect-pg-simple for PostgreSQL session storage

### Development Setup
- **Package Manager**: npm with lockfile version 3
- **TypeScript Configuration**: Shared types between client and server
- **Module System**: ESM (ES Modules) throughout the application
- **Build Process**: Separate builds for client (Vite) and server (esbuild)

## Key Components

### Database Schema
The application uses five main entities with well-defined relationships:

1. **Clients**: Core customer information with contact details
2. **Projects**: Client-associated projects with status tracking, budgets, and progress
3. **Tasks**: Project-scoped work items with assignees, priorities, and due dates
4. **Contracts**: Legal agreements linked to clients and projects with file management
5. **Invoices**: Billing documents with status tracking and client/project associations

### API Structure
RESTful API endpoints organized by resource:
- `/api/clients/*` - Client management operations
- `/api/projects/*` - Project CRUD with client relationships
- `/api/tasks/*` - Task management with project associations
- `/api/contracts/*` - Contract handling with file upload support
- `/api/invoices/*` - Invoice operations with client/project links
- `/api/dashboard/metrics` - Aggregated business metrics

### User Interface
The frontend is organized into distinct functional areas:
- **Dashboard**: Overview with key metrics and recent activity
- **Projects**: Project management with progress tracking
- **Clients**: Customer relationship management
- **Tasks**: Work item tracking with status and priority management
- **Contracts**: Document management with status workflows
- **Invoicing**: Financial document creation and tracking
- **Reports**: Business analytics and insights

## Data Flow

### Request Processing
1. Client requests are handled by Express middleware
2. Request/response logging tracks API performance
3. Zod schemas validate incoming data
4. Drizzle ORM manages database operations
5. Structured JSON responses with error handling

### State Management
1. TanStack Query manages server state caching
2. Form state handled locally with React Hook Form
3. UI state managed through React hooks
4. Optimistic updates for improved user experience

### Database Operations
1. Drizzle ORM provides type-safe database access
2. PostgreSQL handles relational data integrity
3. Migrations managed through Drizzle Kit
4. Connection pooling through Neon serverless driver

## External Dependencies

### UI and Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library
- **class-variance-authority**: Component variant management

### Data and Validation
- **Zod**: Schema validation and type inference
- **date-fns**: Date manipulation utilities
- **TanStack Query**: Server state management

### Development Tools
- **Vite**: Development server and build tool
- **esbuild**: Server-side bundling
- **tsx**: TypeScript execution for development
- **Replit Plugins**: Development environment integration

## Deployment Strategy

### Development Environment
- Vite development server with HMR for frontend
- tsx for running TypeScript server with auto-reload
- Replit-specific plugins for cloud development
- Database connection via environment variables

### Production Build
1. Vite builds optimized client bundle
2. esbuild bundles server for Node.js execution
3. Static assets served from dist/public directory
4. Environment-specific configuration management

### Database Management
- PostgreSQL database provisioned through Neon
- Schema migrations via Drizzle Kit
- Connection string management through DATABASE_URL
- Session storage in PostgreSQL using connect-pg-simple

## Recent Changes

### Sistema de Cobrança Automática, Aprovações e Calendário (28 Jun 2025)
- **Cobrança Automática**: Sistema completo de geração automática de faturas baseado no tempo trabalhado
  - Configurações flexíveis de cobrança (semanal, mensal, por conclusão de projeto)
  - Geração manual de faturas a partir de entradas de tempo selecionadas
  - Cálculo automático de impostos e valores com breakdown detalhado
  - Dashboard com estatísticas de faturamento e horas pendentes
  - Regras de cobrança automática configuráveis por projeto/cliente

- **Sistema de Aprovações**: Workflow completo de aprovações para projetos, faturas, contratos e tarefas
  - Aprovações automáticas baseadas em regras (valor máximo, usuários confiáveis)
  - Interface para processar aprovações com comentários e justificativas
  - Estatísticas de tempo de processamento e análise por tipo de entidade
  - Integração com todas as entidades do sistema para controle de aprovação

- **Calendário Integrado**: Sistema de agendamento e gestão de eventos
  - Visualização semanal com eventos coloridos por tipo (reunião, deadline, marco, lembrete)
  - Criação de eventos com associação a clientes e projetos
  - Eventos recorrentes com padrões configuráveis
  - Detecção automática de conflitos de agenda
  - Integração com deadlines de projetos e tarefas
  - Dashboard com estatísticas de eventos e próximos compromissos

### Sistema de Relatórios Avançados (28 Jun 2025)
- Implementado sistema completo de relatórios com gráficos interativos
- Adicionados componentes RevenueChart, ProjectStatusChart, TaskEfficiencyChart
- Criado serviço de relatórios no backend (reports.ts) com análises detalhadas
- Implementados filtros avançados para personalização de relatórios
- Adicionada funcionalidade de exportação PDF/Excel
- Incluídos KPIs e métricas de performance por cliente
- Sistema de análise de tendências financeiras e operacionais

### Sistema de Automações e Notificações (28 Jun 2025)
- Implementado centro de notificações no cabeçalho com alertas em tempo real
- Sistema automático de lembretes para tarefas, contratos e faturas
- Painel de configuração de automações na página Settings
- Widget de Alertas Inteligentes no dashboard
- APIs para gerenciar notificações e configurações de automação
- Verificações automáticas periódicas com sugestões inteligentes

## Changelog
- June 28, 2025. Initial setup
- June 28, 2025. Sistema de automações e notificações implementado
- June 28, 2025. Sistema de relatórios avançados implementado

## User Preferences

Preferred communication style: Simple, everyday language.