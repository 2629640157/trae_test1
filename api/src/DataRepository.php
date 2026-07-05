<?php

declare(strict_types=1);

final class DataRepository
{
    private string $path;
    private array $data;

    public function __construct(string $path)
    {
        $this->path = $path;
        $content = file_get_contents($path);
        $this->data = json_decode($content ?: '{}', true, flags: JSON_THROW_ON_ERROR);
    }

    public function all(): array
    {
        return $this->data;
    }

    public function users(): array
    {
        return $this->data['users'] ?? [];
    }

    public function documents(array $filters): array
    {
        $items = $this->data['documents'] ?? [];

        return array_values(array_filter($items, function (array $document) use ($filters): bool {
            $keyword = strtolower((string)($filters['keyword'] ?? ''));
            if ($keyword !== '') {
                $haystack = strtolower(implode(' ', [
                    $document['code'],
                    $document['title'],
                    $document['category'],
                    $document['owner'],
                    $document['department'],
                    $document['summary'],
                    implode(' ', $document['tags'] ?? []),
                ]));
                if (!str_contains($haystack, $keyword)) {
                    return false;
                }
            }

            foreach (['code', 'status', 'category', 'department', 'confidentialityLevel'] as $key) {
                if (!empty($filters[$key]) && strcasecmp((string)$document[$key], (string)$filters[$key]) !== 0) {
                    return false;
                }
            }

            return true;
        }));
    }

    public function versionsForDocument(int $documentId): array
    {
        return array_values(array_filter(
            $this->data['versions'] ?? [],
            fn (array $version): bool => (int)$version['documentId'] === $documentId
        ));
    }

    public function approvalTasks(?string $assignee = null): array
    {
        $tasks = $this->data['approvalTasks'] ?? [];
        if ($assignee === null || $assignee === '') {
            return $tasks;
        }

        return array_values(array_filter(
            $tasks,
            fn (array $task): bool => $task['assignee'] === $assignee
        ));
    }

    public function releaseQueue(): array
    {
        return $this->data['releaseQueue'] ?? [];
    }

    public function auditLogs(): array
    {
        return $this->data['auditLogs'] ?? [];
    }

    public function findUser(string $username, string $password): ?array
    {
        foreach ($this->users() as $user) {
            if ($user['username'] === $username && $user['password'] === $password) {
                $safeUser = $user;
                unset($safeUser['password']);
                return $safeUser;
            }
        }

        return null;
    }
}
